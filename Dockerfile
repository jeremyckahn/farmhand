# Dockerfile for Farmhand E2E tests

# ---- Stage 1: Build ----
# This stage builds the React application using a Node.js environment.
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you use Yarn)
# This leverages Docker's cache: if these files haven't changed,
# Docker reuses the cached layer from a previous build where dependencies were installed.
COPY package*.json ./

# Install project dependencies using npm ci.
# `npm ci` is generally faster and more reliable for CI/build environments as it installs
# exact versions from package-lock.json.
RUN npm ci --legacy-peer-deps

# Copy the rest of the application source code into the working directory.
# This includes your src folder, public folder, vite.config.js, index.html, etc.
COPY . .

# Build the application for production.
# This command runs the "build" script defined in your package.json (e.g., "vite build").
# The output will be in the directory specified in vite.config.js (which is 'build' for your project).
RUN npm run build

# ---- Stage 2: Serve ----
# This stage serves the built application using Vite's preview server.
# It also uses a Node.js environment.
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the build output (static assets) from the 'builder' stage to the current stage.
# This takes the contents of /app/dist from the builder stage and copies it to /app/dist here.
COPY --from=builder /app/dist ./dist

# Needed for consistent Vite configuration inside and outside of the container.
COPY --from=builder /app/vite.config.js ./vite.config.js
COPY --from=builder /app/manifest.js ./manifest.js

# Copy package.json. This might not be strictly necessary for `vite preview` itself if all it needs
# are the static files, but it's good practice if any runtime configuration might be read from it
# or if other utilities from node_modules might be used.
COPY package.json ./

# Copy the node_modules from the 'builder' stage.
# This is crucial because it includes Vite (and its dependencies), which is required to run `vite preview`.
COPY --from=builder /app/node_modules ./node_modules

# Install curl for the health check
# The health check uses 'curl', which is not included in the base alpine image by default.
RUN apk add --no-cache curl=8.12.1-r1

# Expose the port the application will run on.
EXPOSE 3000

# Command to run the application using Vite's preview server.
# `npx vite preview` executes the vite binary from the local node_modules.
#   `vite preview` is designed to serve the production build from the output directory (e.g., 'dist').
#   `--port 3000` explicitly sets the port.
#   `--host` makes the server listen on all available network interfaces (0.0.0.0),
#   which is necessary for it to be accessible from outside the container's own network stack
#   (e.g., by other containers on the same Docker network or when port-mapped to the host).
CMD ["npx", "vite", "preview", "--port", "3000", "--host"]
