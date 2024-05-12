export const getDate = () => {
	const today = new Date();
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	const date = today.toLocaleDateString('fr-FR', options);
	return date;
};

export const formatDate = (date) => {
	const today = new Date(date);
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	return today.toLocaleDateString('fr-FR', options);
};
