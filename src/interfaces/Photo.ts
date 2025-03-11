export interface Photo {
	id: string;
	urls: { regular: string };
	user: { name: string; username: string };
	current_user_collections: { title: string };
	links: { html: string };
	description?: string;
	alt_description?: string;
}
