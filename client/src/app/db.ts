import Dexie, { type EntityTable } from 'dexie';

interface Images {
	name: string;
	image: Blob;
}

const db = new Dexie('FriendsDatabase') as Dexie & {
	images: EntityTable<
		Images,
		'name' // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(1).stores({
	images: 'name, image' // primary key "id" (for the runtime!)
});

export { db };
