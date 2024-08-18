const paginateArray = async (page, limit = 10, offset, objects) => {

    const skip = page !== undefined ? (page - 1) * limit : offset;
	const totalItems = objects.length;
	const results = offset >= totalItems ? [] : objects.splice(skip, limit);
	const totalPages = Math.ceil(totalItems / limit);

	const resp = {
		results,
		page: page !== undefined ? Number(page) : undefined,
		offset: offset !== undefined ? Number(offset) : undefined,
		limit: limit !== undefined ? Number(limit) : undefined,
        totalItems: totalItems !== undefined ? Number(totalItems) : undefined,
        totalPages: totalPages !== undefined ? Number(totalPages) : undefined,
	};

	console.log(resp);

	return resp;
};

const paginateQuery = async () => {
	return "NOT YET IMPLEMENTED";
};

export default {
	paginateArray,
	paginateQuery,
};
