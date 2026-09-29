package com.jobfins.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Robust Production DataSource Configuration supporting:
 * 1. External MySQL (Aiven, AWS, PlanetScale, Railway)
 * 2. Render PostgreSQL (DATABASE_URL / postgres:// format)
 * 3. In-memory H2 fallback if no database is specified
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${SPRING_DATASOURCE_URL:}")
    private String springDatasourceUrl;

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${SPRING_DATASOURCE_USERNAME:}")
    private String username;

    @Value("${SPRING_DATASOURCE_PASSWORD:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String effectiveUrl = determineJdbcUrl();
        String effectiveUser = this.username;
        String effectivePass = this.password;

        // 1. Check for Render PostgreSQL DATABASE_URL format (postgres://user:pass@host:port/dbname)
        if (isRenderPostgresUrl(databaseUrl) && (springDatasourceUrl == null || springDatasourceUrl.isBlank() || isPlaceholder(springDatasourceUrl))) {
            try {
                URI uri = new URI(databaseUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                effectiveUrl = "jdbc:postgresql://" + host + ":" + port + path;

                if (uri.getUserInfo() != null) {
                    String[] userParts = uri.getUserInfo().split(":", 2);
                    effectiveUser = userParts[0];
                    if (userParts.length > 1) {
                        effectivePass = userParts[1];
                    }
                }
                log.info("Connecting to Render PostgreSQL database: {}", effectiveUrl);
                return createHikariDataSource(effectiveUrl, effectiveUser, effectivePass, "org.postgresql.Driver");
            } catch (Exception e) {
                log.warn("Failed to parse Render DATABASE_URL ({}), falling back to H2.", databaseUrl, e);
            }
        }

        // 2. Check for configured external database (e.g. Aiven MySQL or custom JDBC)
        if (isValidCustomUrl(effectiveUrl)) {
            // Extract embedded credentials if URL is formatted as jdbc:mysql://user:pass@host:port/db
            ParsedCredentials parsed = parseEmbeddedCredentials(effectiveUrl, effectiveUser, effectivePass);
            effectiveUrl = parsed.cleanUrl;
            effectiveUser = parsed.user;
            effectivePass = parsed.password;

            String driverClass = effectiveUrl.startsWith("jdbc:postgresql:") ? "org.postgresql.Driver" : "com.mysql.cj.jdbc.Driver";
            log.info("Connecting to external database: {} (user: {})", effectiveUrl, effectiveUser);
            return createHikariDataSource(effectiveUrl, effectiveUser, effectivePass, driverClass);
        }

        // 3. Resilient In-Memory H2 Fallback (MySQL Compatibility Mode)
        String h2Url = "jdbc:h2:mem:jobfins_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL";
        log.info("No external database configured. Starting with in-memory database: {}", h2Url);
        return createHikariDataSource(h2Url, "sa", "", "org.h2.Driver");
    }

    private DataSource createHikariDataSource(String url, String user, String pass, String driverClass) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        if (user != null && !user.isBlank()) {
            config.setUsername(user);
        }
        if (pass != null && !pass.isBlank()) {
            config.setPassword(pass);
        }
        config.setDriverClassName(driverClass);
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(30000);
        config.setMaxLifetime(1800000);
        config.setPoolName("JobFinsHikariPool");
        return new HikariDataSource(config);
    }

    private static class ParsedCredentials {
        String cleanUrl;
        String user;
        String password;
        ParsedCredentials(String cleanUrl, String user, String password) {
            this.cleanUrl = cleanUrl;
            this.user = user;
            this.password = password;
        }
    }

    private ParsedCredentials parseEmbeddedCredentials(String rawUrl, String defaultUser, String defaultPass) {
        // Match jdbc:mysql://username:password@host:port/db pattern
        Pattern pattern = Pattern.compile("^(jdbc:(?:mysql|postgresql)://)([^:/@]+):([^@]+)@(.+)$");
        Matcher matcher = pattern.matcher(rawUrl);
        if (matcher.matches()) {
            String prefix = matcher.group(1);
            String user = matcher.group(2);
            String pass = matcher.group(3);
            String rest = matcher.group(4);
            return new ParsedCredentials(prefix + rest, user, pass);
        }
        return new ParsedCredentials(rawUrl, defaultUser, defaultPass);
    }

    private String determineJdbcUrl() {
        if (springDatasourceUrl != null && !springDatasourceUrl.isBlank() && !isPlaceholder(springDatasourceUrl)) {
            return springDatasourceUrl.trim();
        }
        if (databaseUrl != null && !databaseUrl.isBlank() && !isPlaceholder(databaseUrl)) {
            return databaseUrl.trim();
        }
        return "";
    }

    private boolean isRenderPostgresUrl(String url) {
        return url != null && (url.startsWith("postgres://") || url.startsWith("postgresql://"));
    }

    private boolean isPlaceholder(String url) {
        if (url == null || url.isBlank()) return true;
        String lower = url.toLowerCase();
        return lower.contains("<host>") || lower.contains("<dbname>") || lower.contains("placeholder") || lower.contains("your_mysql_password");
    }

    private boolean isValidCustomUrl(String url) {
        if (url == null || url.isBlank() || isPlaceholder(url)) {
            return false;
        }
        if (url.contains("localhost") || url.contains("127.0.0.1")) {
            return false;
        }
        return url.startsWith("jdbc:mysql:") || url.startsWith("jdbc:postgresql:") || url.startsWith("jdbc:h2:") || url.startsWith("jdbc:mariadb:");
    }
}
