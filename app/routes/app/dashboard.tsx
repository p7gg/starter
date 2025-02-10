import { escapeLike } from "@rocicorp/zero";
import { useQuery } from "@rocicorp/zero/react";
import React from "react";
import { useZero } from "~/modules/zero";

export default function Dashboard() {
	const z = useZero();
	const [filter, setFilter] = React.useState("");

	let usersQuery = z.query.user;

	if (filter) {
		usersQuery = usersQuery.where("name", "ILIKE", `%${escapeLike(filter)}%`);
	}

	const [users] = useQuery(usersQuery);

	return (
		<div>
			<input
				value={filter}
				onChange={(e) => setFilter(e.currentTarget.value)}
			/>

			<ul>
				{users.map((u) => (
					<li key={u.id}>
						{u.id} - {u.name}
					</li>
				))}
			</ul>
		</div>
	);
}
