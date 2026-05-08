export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class PaginationUtils {
  /**
   * Parse pagination parameters from request query
   */
  static parsePaginationParams(query: Record<string, unknown>): PaginationParams {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const pageSize = Math.max(
      1,
      Math.min(100, parseInt(query.pageSize as string) || 10)
    ); // Max 100 items per page
    const sortBy = (query.sortBy as string) || "order";
    const sortOrder = (query.sortOrder as "asc" | "desc") || "asc";

    return {
      page,
      pageSize,
      sortBy,
      sortOrder,
    };
  }

  /**
   * Calculate MongoDB skip value
   */
  static calculateSkip(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }

  /**
   * Calculate total pages
   */
  static calculateTotalPages(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  /**
   * Create pagination response
   */
  static createPaginationResult<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number
  ): PaginationResult<T> {
    const totalPages = this.calculateTotalPages(total, pageSize);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Validate pagination parameters
   */
  static validatePaginationParams(params: PaginationParams): string[] {
    const errors: string[] = [];

    if (params.page < 1) {
      errors.push("Page must be greater than 0");
    }

    if (params.pageSize < 1) {
      errors.push("Page size must be greater than 0");
    }

    if (params.pageSize > 100) {
      errors.push("Page size cannot exceed 100");
    }

    return errors;
  }
}
