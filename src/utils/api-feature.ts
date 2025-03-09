import { Query } from "mongoose";

export class ApiFeature<T> {
  query: Query<T[], T>;
  queryString: Record<string, any>;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.max(Number(this.queryString.limit) || 200, 1);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  search() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields"];

    excludeFields.forEach((field) => delete queryObj[field]);

    Object.keys(queryObj).forEach((field) => {
      const value = queryObj[field];

      if (typeof value === "string" && isNaN(Number(value))) {
        this.query = this.query.find({
          [field]: { $regex: value, $options: "i" },
        });
      } else {
        this.query = this.query.find({ [field]: value });
      }
    });

    return this;
  }
}
