export const applyPagination = async (model, query, page = 1, limit = 10, populateOptions = null) => {
    const skip = (page - 1) * limit;
    
    let dataQuery = model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    
    if (populateOptions) {
      dataQuery = dataQuery.populate(populateOptions);
    }
  
    const data = await dataQuery;
    const total = await model.countDocuments(query);
  
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };
  