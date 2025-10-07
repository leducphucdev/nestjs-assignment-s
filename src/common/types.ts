export enum TaskStatus {
	TODO = "TODO",
	DOING = "DOING",
	IN_REVIEW = "IN REVIEW",
	DONE = "DONE",
	DROPPED = "DROPPED",
}

export interface DeleteStatus {
	deleted: boolean;
	message: string;
}
