module.exports = {
    mockRequest : ()=>{
        const req = {};
        req.body = jest.fn().mockReturnValue(req);
        req.params = jest.fn().mockReturnValue(req);
        return req;
    },

    mockResponse : ()=>{
        const res = {};
        res.send = jext.fn().mockReturnValue(res);
        res.status = jext.fn().mockReturnValue(res);
        res.json = jext.fn().mockReturnValue(res);
        res.end = jext.fn().mockReturnValue(res);
        return res;
    }
}