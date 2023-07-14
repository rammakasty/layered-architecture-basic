const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;
    // 비어 있을 때를 대비
    const [authType, authToken] = (Authorization ?? '').split(' ');

    // Bearer는 JWT라는 것을 알려주는 표식이다.
    if (authType !== 'Bearer' || !authToken) {
        res.status(400).json({
            errorMessage: '로그인이 필요한 기능입니다.',
        });
        return;
    }

    // jwt 검증
    try {
        // 1. authToken이 만료되었는지 확인
        // 2. authToken이 서버가 발급한 토큰이 맞는지 확인
        const { userId } = jwt.verify(authToken, 'secret_key_hh_node_js');
        // 3. authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
        const user = await Users.findOne({
            where: { userId },
            attributes: ['userId', 'nickname'],
        });
        res.locals.user = user;

        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
            return;
        }

        res.status(400).json({ errorMessage: '로그인이 필요한 기능입니다.' });
        return;
    }
};
