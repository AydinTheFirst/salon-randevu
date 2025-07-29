type obj = Record<string, unknown>;

interface QueryParams {
  fields?: string;
  include?: string;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  search?: string;
  sort?: string;
}

export class BaseService<T, WhereInput = obj> {
  constructor(
    private readonly prismaModel: {
      count: (args: { where?: WhereInput }) => Promise<number>;
      findMany: (args: obj) => Promise<T[]>;
    },
  ) {}

  parseIncludeParam(param: string) {
    const include: obj = {};

    for (const path of param.split(',')) {
      const keys = path.trim().split('.');
      let current = include;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (i === keys.length - 1) {
          if (typeof current[key] !== 'object') {
            current[key] = true;
          }
        } else {
          if (!current[key] || current[key] === true) {
            current[key] = { include: {} };
          }
          // @ts-expect-error unknown type
          current = current[key].include;
        }
      }
    }

    return include;
  }

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

    const prismaQuery: obj = {
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
      prismaQuery.include = this.parseIncludeParam(include);
    }

    // @ts-expect-error unknown type
    return prismaQuery;
  }
}
