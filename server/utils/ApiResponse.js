class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }

  static success(statusCode, message, data = null, meta = null) {
    return new ApiResponse(statusCode, message, data, meta);
  }

  static created(message, data = null) {
    return new ApiResponse(201, message, data);
  }

  static error(statusCode, message, errors = []) {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }
}

export default ApiResponse;
