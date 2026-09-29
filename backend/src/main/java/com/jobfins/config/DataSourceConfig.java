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

/**
 * Robust DataSource Configuration supporting:
 * 1. Render PostgreSQL (DATABASE_URL / postgres:// format)
 * 2. External MySQL (SPRING_DATASOURCE_URL / jdbc:mysql:// format)
 * 3. In-memory H2 fallback with MySQL mode if no valid database URL is provided
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

        // Check if databaseUrl was provided as postgres:// user:pass@host:port/dbname
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
                log.info("Configured PostgreSQL DataSource from Render DATABASE_URL: {}", effectiveUrl);
                return DataSourceBuilder.create()
                        .url(effectiveUrl)
                        .username(effectiveUser)
                        .password(effectivePass)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            } catch (Exception e) {
                log.warn("Failed to parse Render DATABASE_URL ({}), falling back to H2.", databaseUrl, e);
            }
        }

        // Validate if custom SPRING_DATASOURCE_URL is valid
        if (isValidCustomUrl(effectiveUrl)) {
            log.info("Configuring DataSource with custom URL: {}", effectiveUrl);
            return DataSourceBuilder.create()
                    .url(effectiveUrl)
                    .username(effectiveUser.isBlank() ? "root" : effectiveUser)
                    .password(effectivePass)
                    .build();
        }

        // Resilient Fallback to H2 in-memory (MySQL Mode)
        String h2Url = "jdbc:h2:mem:jobfins_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL";
        log.warn("No valid external database configured or placeholder detected. Falling back to embedded H2: {}", h2Url);
        return DataSourceBuilder.create()
                .url(h2Url)
                .username("sa")
                .password("")
                .driverClassName("org.h2.Driver")
                .build();
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
