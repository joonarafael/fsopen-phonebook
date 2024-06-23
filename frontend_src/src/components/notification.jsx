const Notification = (props) => {
	if (props.message.length === 0) {
		return null;
	}

	if (props.status === "error") {
		return (
			<div
				style={{
					border: "2px solid red",
					borderRadius: "5px",
					maxWidth: "720px",
					padding: "8px",
					color: "red",
					backgroundColor: "lightgrey",
				}}
			>
				{props.message}
			</div>
		);
	}

	return (
		<div
			style={{
				border: "2px solid green",
				borderRadius: "5px",
				maxWidth: "720px",
				padding: "8px",
				color: "green",
				backgroundColor: "lightgrey",
			}}
		>
			{props.message}
		</div>
	);
};

export default Notification;
