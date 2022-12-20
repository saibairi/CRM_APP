const { default: mongoose } = require("mongoose");
const { index, create, read, update, destroy } = require("../../../controllers/user.controller");
const { User } = require("../../../models");
const { connect, clear, close } = require("../../db");
const { mockRequest, mockResponse } = require("../../interceptor");

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => close());

const payload = {
    _id: '6378a804b5bbfec8ae71acb3',
    name: 'Test Name',
    username: 'testname',
    password: '123456',
    email: 'test@mail.com'
};

describe('index', () => {
    it('should respond 200 on success with empty array', async () => {
        // arrange
        const req = mockRequest();
        const res = mockResponse();
        
        // act
        await index(req, res);

        // assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([])
        );
    })

    it('should respond 200 on success with array of objects', async () => {
        // arrange
        const spyUserFind = jest.spyOn(User, 'find').mockResolvedValue([
            new User(payload)
        ]);
        const req = mockRequest();
        const res = mockResponse();
        
        // act
        await index(req, res);

        // assert
        expect(spyUserFind).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    _id: mongoose.Types.ObjectId(payload._id),
                    name: payload.name,
                    username: payload.username,
                    email: payload.email,
                })
            ])
        );
    })

    it('should respond 500 on failure with error message', async () => {
        // arrange
        const spyUserFind = jest.spyOn(User, 'find').mockRejectedValue('error');
        const req = mockRequest();
        const res = mockResponse();
        
        // act
        await index(req, res);

        // assert
        expect(spyUserFind).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })
});

describe('create', () => {
    it('should respond 201 on success with created object', async () => {

        // arrange
        const req = mockRequest();
        const res = mockResponse();
        req.body = payload;

        // act
        await create(req, res);

        // assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                name: payload.name,
                username: payload.username,
                email: payload.email,
                role: payload.role || 'customer',
                isEnabled: payload.isEnabled || payload.role === 'customer' || !payload.role,
            })
        );
    })

    it('should respond 500 on failure with error message', async () => {

        // arrange
        const spyUserCreate = jest.spyOn(User, 'create').mockRejectedValue('error');
        const req = mockRequest();
        const res = mockResponse();
        req.body = payload;

        // act
        await create(req, res);

        // assert
        expect(spyUserCreate).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })
});

describe('read', () => {
    it('should respond 200 on success with requested object', async () => {

        // arrange
        const spyUserFindById = jest.spyOn(User, 'findById').mockResolvedValue(new User(payload));
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = payload._id;

        // act
        await read(req, res);

        // assert
        expect(spyUserFindById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                name: payload.name,
                username: payload.username,
                email: payload.email
            })
        );
    })

    it('should respond 404 on data null with error message', async () => {

        // arrange
        const spyUserFindById = jest.spyOn(User, 'findById').mockResolvedValue(null);
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = payload._id;

        // act
        await read(req, res);

        // assert
        expect(spyUserFindById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })

    it('should respond 404 on invalid id with error message', async () => {

        // arrange
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 1;

        // act
        await read(req, res);

        // assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })

    it('should respond 500 on failure with error message', async () => {

        // arrange
        const spyUserFindById = jest.spyOn(User, 'findById').mockRejectedValue('error');
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = payload._id;

        // act
        await read(req, res);

        // assert
        expect(spyUserFindById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })
});

describe('update', () => {
    it('should respond 200 on success with requested object', async () => {

        // arrange
        const spyUserFindById = jest.spyOn(User, 'findById').mockResolvedValue(new User(payload));
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = payload._id;
        req.body = payload;

        // act
        await read(req, res);

        // assert
        expect(spyUserFindById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                name: payload.name,
                username: payload.username,
                email: payload.email
            })
        );
    })

    it('should respond 404 on data null with error message', async () => {

        // arrange
        const spyUserFindById = jest.spyOn(User, 'findById').mockResolvedValue(null);
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = payload._id;

        // act
        await read(req, res);

        // assert
        expect(spyUserFindById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })

    it('should respond 404 on invalid id with error message', async () => {

        // arrange
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 1;

        // act
        await read(req, res);

        // assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })

    it('should respond 500 on failure with error message', async () => {

        // arrange
        const spyUserFindById = jest.spyOn(User, 'findById').mockRejectedValue('error');
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = payload._id;

        // act
        await read(req, res);

        // assert
        expect(spyUserFindById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })
});