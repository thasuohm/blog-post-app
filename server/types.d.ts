declare module 'my-environment-variables' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string
        PORT: string
        // Add more environment variables as needed
      }
    }
  }
}
