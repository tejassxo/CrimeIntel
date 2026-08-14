# Multi-stage production container for Cyber Jagruti Portal
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency specifications if any
COPY package.json ./

# Final runtime image
FROM python:3.11-slim AS runner

WORKDIR /app

# Create non-root system user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy application artifacts
COPY --chown=appuser:appgroup . /app

# Switch to non-root user
USER appuser

# Expose HTTP port
EXPOSE 8080

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=8080

# Healthcheck definition
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080')" || exit 1

# Launch production HTTP server
CMD ["python", "server.py"]
