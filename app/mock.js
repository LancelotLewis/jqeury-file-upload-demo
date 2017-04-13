var Random = Mock.Random;

Mock.mock(/upload/, function() {
    var status = Random.integer(0, 1);
    console.log('upload', status);
    return {
        status: status,
        message: '测试'
    };
});
Mock.mock(/check/, function() {
    var status = Random.integer(0, 1);
    console.log('check', status);
    return {
        status: status
    };
});
