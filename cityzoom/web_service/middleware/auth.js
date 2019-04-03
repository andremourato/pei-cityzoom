export default async function(context) {
    const { state } =  context.store     
    if(!state.priviledge==-1 || state.jwt=='') {
        const { req } = context
        let jwt;
        if(req && req.headers) {
            const cookie = req.headers.cookie
            if(cookie) {
                console.log(cookie)
                jwt = cookie
                        .split('; ')
                        .find(c => c.startsWith('jwt='))
                if(jwt) 
                    jwt = jwt.split('=')[1]
    
            }
        } else if(process.client && state.jwt) {
             jwt = state.jwt; 
        }
        if(jwt) {
            const error = await context.store.dispatch('renew_data', jwt)
            if(!error) {
                if(context.route.path == '/')
                    context.redirect('/homepage')
                return
            }
        } 
        context.redirect('/')
    } 
}