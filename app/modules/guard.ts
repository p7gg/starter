import { P, isMatching } from "ts-pattern";

export namespace G {
	export const isString = isMatching(P.string);

	export const isBigint = isMatching(P.bigint);

	export const isBoolean = isMatching(P.boolean);

	export const isNonNullable = isMatching(P.nonNullable);

	export const isNullish = isMatching(P.nullish);

	export const isNumber = isMatching(P.number);

	export const isSymbol = isMatching(P.symbol);

	export const isMap = isMatching(P.map());

	export const isSet = isMatching(P.set());

	export const isArray = isMatching(P.array());
}
