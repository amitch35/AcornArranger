export default {
    build: {
      rollupOptions: {
        input: {
          main: './index.html',
          login: './login.html'
        }
      }
    },
    server: {
      proxy: {
        "/api": "http://localhost:3000",
        "/auth": "http://localhost:3000"
      }
    }
    // build: {
    //     target: "ESNext",
    // },
    // esbuild: {
    //     target: "ESNext",
    // },
    // optimizeDeps:{
    //     esbuildOptions: {
    //         target: "ESNext",
    //     }
    // }
  };