export class EmailError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'EmailError'
  }

  static fromResendError(error: any): EmailError {
    if (error.name === 'validation_error') {
      return new EmailError(
        'Domain not verified. Please verify domain in Resend dashboard.',
        'DOMAIN_NOT_VERIFIED',
        error.statusCode,
        error
      )
    }

    return new EmailError(
      error.message || 'Unknown email error',
      'UNKNOWN_ERROR',
      error.statusCode,
      error
    )
  }
} 