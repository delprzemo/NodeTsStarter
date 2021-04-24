import supertest from 'supertest';
import { getConnection } from 'typeorm';
import { User } from "../src/entities/User";
import { intializeDB } from "../src/db";

import { OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import app from '../src/Server';
import { pErr } from '../src/shared/functions';


describe('Users Routes', () => {
    const usersPath = '/api/users';
    const getUsersPath = `${usersPath}/all`;

    // Delcaring agent (like TestBed => mocked env)
    let agent: SuperTest<Test>;
    const testUsers: User[] = [
        { firstName: 'Jack', lastName: 'Ripper', age: 14, id: "1" },
        { firstName: 'Elon', lastName: 'Carman', age: 63, id: "2" }
    ]

    // Add data to db
    async function createTestData() {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(testUsers)
            .execute();
    }

    // remove data from db
    async function destroyTestData() {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(User)
            .execute();
    }

    beforeAll(async () => {
        // assign app to test agent
        agent = supertest.agent(app);
        await intializeDB();
        await destroyTestData();
        await createTestData();
    });

    afterAll(async () => {
       await destroyTestData();
    });

    describe(`"GET:${getUsersPath}"`, () => {
        it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {
           
            agent.get(getUsersPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    const retUsers = res.body.users;
                    expect(retUsers[0].firstName).toEqual(testUsers[0].firstName);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });
    });
});
