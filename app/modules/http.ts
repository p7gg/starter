import { data } from "react-router";

export namespace Http {
	/**
	 * Merge multiple headers objects into one (uses set so headers are overridden)
	 */
	export function mergeHeaders(
		...headers: Array<ResponseInit["headers"] | null | undefined>
	) {
		const merged = new Headers();
		for (const header of headers) {
			if (!header) continue;
			const headerObj =
				header instanceof Headers ? header : new Headers(header);
			for (const [key, value] of headerObj.entries()) {
				merged.set(key, value);
			}
		}
		return merged;
	}

	/**
	 * Combine multiple header objects into one (uses append so headers are not overridden)
	 */
	export function combineHeaders(
		...headers: Array<ResponseInit["headers"] | null | undefined>
	) {
		const combined = new Headers();
		for (const header of headers) {
			if (!header) continue;
			const headerObj =
				header instanceof Headers ? header : new Headers(header);

			for (const [key, value] of headerObj.entries()) {
				combined.append(key, value);
			}
		}
		return combined;
	}

	/**
	 * Combine multiple response init objects into one (uses combineHeaders)
	 */
	export function combineResponseInits(
		...responseInits: Array<ResponseInit | null | undefined>
	) {
		let combined: ResponseInit = {};
		for (const responseInit of responseInits) {
			combined = {
				...responseInit,
				headers: combineHeaders(combined.headers, responseInit?.headers),
			};
		}
		return combined;
	}

	export function badRequest<T>(body: T) {
		return data(body, {
			status: 400,
			statusText: "Bad Request",
			headers: {
				"Content-Type":
					typeof body === "string" ? "text/plain" : "application/json",
			},
		});
	}

	export function ok<T>(body: T) {
		return data(body, {
			status: 200,
			statusText: "OK",
			headers: {
				"Content-Type":
					typeof body === "string" ? "text/plain" : "application/json",
			},
		});
	}
}
