export const mergeArrays = (expenses, sales) => {
	const combinedMap = {};

	const mergeObjects = (target, source) => {
		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				target[key] = source[key];
			}
		}
	};

	expenses.forEach((item) => {
		combinedMap[item._id] = { ...item };
	});

	sales.forEach((item) => {
		if (combinedMap[item._id]) {
			mergeObjects(combinedMap[item._id], item);
		} else {
			combinedMap[item._id] = { ...item };
		}
	});

	return Object.values(combinedMap);
};
