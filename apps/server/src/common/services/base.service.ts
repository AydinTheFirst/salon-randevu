interface QueryParams {
  fields?: string;
  include?: string;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  search?: string;
  sort?: string;
}

export class BaseService<T, WhereInput = any> {
  constructor(
    private readonly prismaModel: {
      count: (args: { where?: WhereInput }) => Promise<number>;
      findMany: (args: any) => Promise<T[]>;
    },
  ) {}

  async queryAll(
    query: QueryParams,
    searchableFields: (keyof T)[] = [],
    customWhere: WhereInput = {} as WhereInput,
  ) {
    const baseQuery = this.buildPrismaQuery(query, searchableFields);

    baseQuery.where = {
      ...(baseQuery.where || {}),
      ...(customWhere || {}),
    } as WhereInput;

    const [items, total] = await Promise.all([
      this.prismaModel.findMany(baseQuery),
      this.prismaModel.count({ where: baseQuery.where }),
    ]);

    return {
      items,
      meta: {
        page: Math.floor((baseQuery.skip ?? 0) / (baseQuery.take ?? 10)) + 1,
        pageCount: Math.ceil(total / (baseQuery.take ?? 10)),
        total,
      },
    };
  }

  protected buildPrismaQuery(
    query: QueryParams,
    searchableFields: (keyof T)[] = [],
  ): {
    include?: Record<string, boolean>;
    orderBy: Record<string, 'asc' | 'desc'>;
    select?: Record<string, boolean>;
    skip?: number;
    take?: number;
    where?: WhereInput;
  } {
    const {
      fields,
      include,
      limit = 10,
      offset = 0,
      order = 'desc',
      search,
      sort = 'createdAt',
    } = query;

    const prismaQuery: any = {
      orderBy: { [sort]: order },
      skip: Number(offset),
      take: Number(limit),
    };

    if (search && searchableFields.length > 0) {
      prismaQuery.where = {
        OR: searchableFields.map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
      };
    }

    if (fields && include) {
      throw new Error("You cannot use both 'fields' (select) and 'include' at the same time.");
    }

    if (fields) {
      prismaQuery.select = Object.fromEntries(fields.split(',').map((key) => [key.trim(), true]));
    }

    if (include) {
      prismaQuery.include = Object.fromEntries(include.split(',').map((key) => [key.trim(), true]));
    }

    return prismaQuery;
  }
}
