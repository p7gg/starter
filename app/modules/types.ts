type UnionToIntersection<union> =
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	(union extends any ? (k: union) => void : never) extends (
		k: infer intersection,
	) => void
		? intersection
		: never;

type GetUnionLast<Union> = UnionToIntersection<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	Union extends any ? () => Union : never
> extends () => infer Last
	? Last
	: never;

export type UnionToTuple<Union, Tuple extends Array<unknown> = []> = [
	Union,
] extends [never]
	? Tuple
	: UnionToTuple<
			Exclude<Union, GetUnionLast<Union>>,
			[GetUnionLast<Union>, ...Tuple]
		>;
