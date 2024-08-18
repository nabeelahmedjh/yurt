import { Server, User } from "../models/index.js";
import { serversService } from "../services/index.js";
const createServer = async (req, res) => {
	const { name, description } = req.body;
	let tags = req.body.tags ?? [];
	const user = req.user.user;
	const banner = req.file
		? {
				name: req.file.originalname,
				size: req.file.size,
				type: req.file.mimetype,
				source: req.file.path,
		  }
		: null;

	if (typeof tags === "string") {
		tags = JSON.parse(tags);
	}

	if (!name) {
		return res.status(400).json({
			error: { message: "name is required" },
		});
	}

	if (!description) {
		return res.status(400).json({
			error: { message: "description is required" },
		});
	}

	try {
		const newServer = await serversService.createServer(
			name,
			description,
			user,
			banner,
			tags
		);

		return res.status(201).json({
			data: newServer,
		});
	} catch (error) {
		return res.status(500).json({
			error: {
				message: error.message,
			},
		});
	}
};

const getServers = async (req, res) => {
	const type = req.query.type ?? "";
	const search = req.query.search ?? "";
	let tags = req.query.tags ?? [];

	try {
		if (!type || type === "joined") {
			const servers = await serversService.getJionedServers(req, res);
			return res.status(200).json({
				data: servers,
			});
		} else if (type === "all") {
			const user = req.user;
			const userId = user.user._id;

			const servers = await serversService.getAllServers(userId, search, tags);
			return res.status(200).json({
				data: servers,
			});
		} else {
			return res.status(400).json({
				data: "Please apply filter correctly. type=joined 0r type=all.",
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: { message: error.message },
		});
	}
};

const createSpace = async (req, res) => {
	const { serverId } = req.params;
	const { name, description } = req.body;
	const type = req.body.type ?? "chat";

	if (!serverId) {
		return res.status(400).json({
			error: { message: "ServerId is required" },
		});
	}

	if (!name) {
		return res.status(400).json({
			error: { message: "Name is required" },
		});
	}

	if (!description) {
		return res.status(400).json({
			error: { message: "Description is required" },
		});
	}

	try {
		const newSpace = await serversService.createSpace(
			serverId,
			name,
			description,
			type
		);
		return res.status(201).json({
			data: newSpace,
		});
	} catch (error) {
		return res.status(400).json({
			error: { message: error.message },
		});
	}
};

const joinServer = async (req, res) => {
	try {
		const { serverId } = req.params;
		const user = req.user.user;
		const server = await Server.findOne({
			_id: serverId,
		});

		if (!server || server.length === 0) {
			return res.status(404).json({
				error: { message: "Server not found" },
			});
		}

		if (server.members.includes(user._id)) {
			return res.status(400).json({
				error: { message: "User already in server" },
			});
		}

		server.members.push(user._id);
		await server.save();

		try {
			const currentUser = await User.findOne({ _id: user._id });
			currentUser.serversJoined.push(server._id);
			await currentUser.save();
		} catch (error) {
			return res.status(500).json({
				error: { message: error.message },
			});
		}

		return res.status(201).json({
			data: server,
		});
	} catch (error) {
		return res.status(500).json({
			error: { message: error.message },
		});
	}
};

const getMembers = async (req, res) => {
	const { serverId } = req.params;
	const type = req.query.type ?? "";
	const page = req.query.page ?? "";
	const limit = req.query.limit ?? 10;
	const offset = page === "" ? req.query.offset ?? '' :  (page - 1) * limit;

	if (!type) {
		return res.status(400).json({
			error: {
				message: "Please provide type",
			},
		});
	}

	if (!serverId) {
		return res.status(400).json({
			error: { message: "ServerId is required" },
		});
	}

	let resp = null;
	try {
		resp = await serversService.getMembersByServerId(
			serverId,
			page,
			limit,
			offset,
			type
		);

		return res.status(200).json({
			data: resp.results,
			page: resp.page,
			offset: resp.offset,
			limit: resp.limit,
			totalItems: resp.totalItems,
			totalPages: resp.totalPages,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: { message: error.message },
		});
	}

	res.json({
		data: "getMembers",
	});
};

export default {
	createServer,
	getServers,
	createSpace,
	joinServer,
	getMembers,
};
