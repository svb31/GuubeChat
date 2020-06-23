import asyncio
import aiohttp.web as web

async def allow_CORS(request, response):
    response.headers['Access-Control-Allow-Origin'] = 'https://cdpn.io'

async def GET_index(req):
    raise web.HTTPFound('static/index.html')

async def GET_chat_getmsg(req):

    req_firstid = int(req.query.getone('firstid', 0))
    firstid = req.app['firstid']
    msglist = req.app['msglist']

    if req_firstid <= firstid:
        data = {'firstid': req_firstid, 'msg': msglist}
    elif req_firstid <= firstid + len(msglist):
        i0 = req_firstid - firstid
        data = {'firstid': req_firstid, 'msg': msglist[i0:]}
    else:
        data = {'firstid': None, 'msg': []}

    return web.json_response(data)

async def POST_chat_postmsg(req):

    data = await req.json()
    if not isinstance(data, dict) \
            or not 'name' in data \
            or not isinstance(data['name'], str) \
            or not 'msg' in data \
            or not isinstance(data['msg'], str):
        raise web.HTTPBadRequest()

    msg = (data['name'], data['msg'])
    req.app['msglist'].append(msg)

    if len(req.app['msglist']) > 200:
        req.app['firstid'] += 100
        req.app['msglist'] = req.app.msglist[100:]

    return web.HTTPOk()

def main():
    app = web.Application()
    #app.on_response_prepare.append(allow_CORS)
    app.add_routes([
        web.get('/', GET_index),
        web.get('/chat/getmsg', GET_chat_getmsg),
        web.post('/chat/postmsg', POST_chat_postmsg),
        web.static('/static', 'static')
        ])
    app['msglist'] = [
        ('Chatbox', 'Welcome to this new chat!'),
        ('Chatbox', 'Type something if you want to :)'),
        ]
    app['firstid'] = 0
    web.run_app(app, host='localhost', port=8100)

if __name__ == '__main__':
    main()

# vim: ts=4 sw=4 et ai sta
