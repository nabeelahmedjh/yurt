const paginateArray = async (page, limit = 10, offset, objects) => {
	console.log("offset", offset);
	const skip = page !== "" ? (page - 1) * limit : offset;
	console.log(skip);
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
