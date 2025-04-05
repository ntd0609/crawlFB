const request = require('request-promise');
const cheerio = require('cheerio');
let replaceall = require("replaceall");
let list_close_tag = ['</p>','</h1>','</h2>','</h3>','</h4>','</h5>','</h6>','</b>','</table>','</ul>','</ol>','<br>','</br>','<hr>','</hr>','</body>','</html>','</head>','</title>']
module.exports = async ({title,content,avatar,hostname},{pageId,access_token,cookie},user_id)=>{
	let list_block_key = await BlockKeyWord.find({user_id}); // lấy danh sách các từ khóa bị cấm
	let find_block_keyword = list_block_key.find(({keyword})=>(content.includes(keyword) || title.includes(keyword))); // kiểm tra xem có từ khóa cấm nào trong nội dung bài viết hay không
	if(find_block_keyword) return; // nếu có thì dừng lại ngay

    // chỉnh sửa các trình bày nội dung bài viết
    for(let tag_close of list_close_tag){
    	var re = new RegExp(tag_close, 'g');

    	content = content.replace(re, tag_close+'lkasdfhkasudfweu');

    }

    let $ = cheerio.load(content);
    let body = $.text().trim().replace(/\s+/g, " ").replace(/lkasdfhkasudfweu/g,'\n\n').split('\n\n').map(e=>e.trim()).join('\n\n');



    let list_hot_keyword = await HotKeyWordFB.find({user_id});

    for(let {normal,special} of list_hot_keyword){

    	body = replaceall(normal,special,body);
    	title = replaceall(normal,special,title);


    }
    let message = title+'\n\n'+body+'\n\nNguồn: '+hostname;
    if((avatar || '').includes('http')){

        var headers = {
            'authority': 'graph.facebook.com',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="99", "Opera";v="85"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'none',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'accept-language': 'en-US,en;q=0.9',
            cookie
        };
    	var options = {
    		url:'https://graph.facebook.com/'+pageId+'/photos',
    		method:'POST',
    		headers,
    		form:{
    			published:true, 
    			message, 
    			url:avatar
    		},
    		qs:{
    			access_token
    		}
    	}
    }else{
        var headers = {
            'authority': 'graph.facebook.com',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="99", "Opera";v="85"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'none',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'accept-language': 'en-US,en;q=0.9',
            cookie
        };
    	var options = {
    		url:'https://graph.facebook.com/'+pageId+'/feed',
    		method:'POST',
    		headers,
    		form:{
    			published:true, 
    			message 
    		},
    		qs:{
    			access_token
    		}
    	}
    }




let responseText = await request(options);
return JSON.parse(responseText);
};
