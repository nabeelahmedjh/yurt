const paginateArray = async (page, limit = 10, offset, objects) => {
	const skip = page !== "" ? (page - 1) * limit : offset;
	const totalItems = objects.length;
	const results = offset >= totalItems ? [] : objects.splice(skip, limit);
	const totalPages = Math.ceil(totalItems / limit);

	const resp = {
		results,
		page: page !== "" ? Number(page) : 1,
		offset: skip !== undefined ? Number(skip) : undefined,
		limit: limit !== undefined ? Number(limit) : undefined,
		totalItems: totalItems !== undefined ? Number(totalItems) : undefined,
		totalPages: totalPages !== undefined ? Number(totalPages) : undefined,
	};

	return resp;
};

const paginateQuery = async () => {
	return "NOT YET IMPLEMENTED";
};

export default {
	paginateArray,
	paginateQuery,
};
