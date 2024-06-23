const Search = (props) => {
	return (
		<div>
			filter shown with{" "}
			<input
				value={props.searchValue}
				onChange={(e) => props.setSearchValue(e.target.value)}
			/>
		</div>
	);
};

export default Search;
