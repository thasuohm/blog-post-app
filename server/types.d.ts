declare module 'my-environment-variables' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        // Add more environment variables as needed
        DATABASE_URL: string
        PORT: string
      }
    }
  }
}
