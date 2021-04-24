import { Tedis } from 'tedis';
import { User } from 'src/entities/User';
import { getConnection } from 'typeorm';

export class UserService {
    private tedis: Tedis;

    public async getAll(): Promise<User[]> {
        const users = await getConnection()
        .getRepository(User)
        .createQueryBuilder("user")
        .getMany();

        return users;
    }


    public async get(id: string): Promise<User | undefined> {
        const user = await getConnection()
        .createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.id = :id", { id: id })
        .getOne();

        return user;
    }

    public async add(user: {firstName: string, lastName: string, age: number}): Promise<string> {
        const id = this.uuidv4();

        await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
            {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                id: id
            }
        ])
        .execute();

        return id;
    }

    public async update(user: {firstName: string, lastName: string, age: number, id: string}): Promise<string> {
        await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ 
            firstName: user.firstName, 
            lastName: user.lastName,
            age: user.age
        })
        .where("id = :id", { id: user.id })
        .execute();

        return user.id;
    }


    public async delete(id: string): Promise<string> {

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("id = :id", { id: id })
        .execute();

        return id;
    }


    private uuidv4(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
}