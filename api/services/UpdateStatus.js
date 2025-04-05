let waitTime = time=>{
	return new Promise(resolve=>{
		setTimeout(function(){
			return resolve(time)
		},time)
	});
};

(async ()=>{
	await waitTime(30000);
	let list_urlscan = await UrlScan.find({status:true});
	
	await LogTokenScan.destroy({});
	let list_token_used = await Token.find({used:true});
	for(let {id} of list_token_used) await Token.update({id}).set({used:false})
	

	
	let map_action =  list_urlscan.map(({id,user_id})=>Realtime(id,user_id));
    return await Promise.all(map_action);
})();
