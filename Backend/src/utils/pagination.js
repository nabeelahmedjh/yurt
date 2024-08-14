const paginate = async (model, query, { page, limit = 10, offset }, populateOptions) => {
    let skip = 0;

    if (offset !== undefined || !offset) {
        // Offset-based pagination
        skip = Number(offset);
    } else if (page !== undefined) {
        // Page-based pagination
        skip = (Number(page) - 1) * limit;
    }

    const results = await model.find(query)
        .skip(skip)
        .limit(Number(limit))
        .papulate(populateOptions);

    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    return {
        results,
        page: page !== undefined ? Number(page) : undefined,
        offset: offset !== undefined ? Number(offset) : undefined,
        totalPages,
        totalItems,
    };
};

export default paginate;