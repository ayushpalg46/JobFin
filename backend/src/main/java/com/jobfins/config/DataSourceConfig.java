package com.jobfins.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;

/**
 * Robust DataSource Configuration supporting:
 * 1. Render PostgreSQL (DATABASE_URL / postgres:// format)
 * 2. External MySQL (SPRING_DATASOURCE_URL / jdbc:mysql:// format)
 * 3. In-memory H2 fallback with MySQL mode if no valid/reachable database is provided
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

        // 1. Check if databaseUrl was provided as postgres:// user:pass@host:port/dbname (Render PostgreSQL)
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

                if (canConnect(effectiveUrl, effectiveUser, effectivePass, "org.postgresql.Driver")) {
                    log.info("Successfully connected to Render PostgreSQL: {}", effectiveUrl);
                    return DataSourceBuilder.create()
                            .url(effectiveUrl)
                            .username(effectiveUser)
                            .password(effectivePass)
                            .driverClassName("org.postgresql.Driver")
                            .build();
                } else {
                    log.warn("Could not establish connection to PostgreSQL ({}). Using embedded H2 fallback.", effectiveUrl);
                }
            } catch (Exception e) {
                log.warn("Failed to parse Render DATABASE_URL ({}), falling back to H2.", databaseUrl, e);
            }
        }

        // 2. Validate custom external database (e.g. MySQL)
        if (isValidCustomUrl(effectiveUrl)) {
            String driverClass = effectiveUrl.startsWith("jdbc:postgresql:") ? "org.postgresql.Driver" : "com.mysql.cj.jdbc.Driver";
            String user = (effectiveUser != null && !effectiveUser.isBlank()) ? effectiveUser : "root";
            
            if (canConnect(effectiveUrl, user, effectivePass, driverClass)) {
                log.info("Successfully connected to external database: {}", effectiveUrl);
                return DataSourceBuilder.create()
                        .url(effectiveUrl)
                        .username(user)
                        .password(effectivePass)
                        .driverClassName(driverClass)
                        .build();
            } else {
                log.warn("External database at '{}' is unreachable from container. Falling back to embedded H2.", effectiveUrl);
            }
        }

        // 3. Resilient In-Memory H2 Fallback (MySQL Mode) - Guarantees container starts cleanly
        return createFallbackH2DataSource();
    }

    private DataSource createFallbackH2DataSource() {
        String h2Url = "jdbc:h2:mem:jobfins_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL";
        log.info("Starting with standalone in-memory database: {}", h2Url);
        return DataSourceBuilder.create()
                .url(h2Url)
                .username("sa")
                .password("")
                .driverClassName("org.h2.Driver")
                .build();
    }

    private boolean canConnect(String url, String user, String pass, String driverClassName) {
        if (url.contains("localhost") || url.contains("127.0.0.1")) {
            // Inside container, localhost has no DB server running
            log.warn("Database URL points to localhost ({}), which is not running inside the cloud container.", url);
            return false;
        }

        try {
            Class.forName(driverClassName);
            DriverManager.setLoginTimeout(3); // 3 seconds timeout to avoid hanging startup
            try (Connection conn = DriverManager.getConnection(url, user != null ? user : "", pass != null ? pass : "")) {
                return conn.isValid(2);
            }
        } catch (Throwable t) {
            log.warn("Database connection probe failed for '{}': {}", url, t.getMessage());
            return false;
        }
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
        return url.startsWith("jdbc:mysql:") || url.startsWith("jdbc:postgresql:") || url.startsWith("jdbc:h2:") || url.startsWith("jdbc:mariadb:");
    }
}
