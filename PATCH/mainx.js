; (async () => {
    let offset = 0
    let max
    while (true) {
        let re = await fetch(`https://api.modrinth.com/v2/search?limit=100&offset=${offset}&index=relevance&facets=[[%22project_type:mod%22]]`)
        let res = await re.json()
        if (re.status < 200 || re.status > 299) return (() => {console.log(re.status);console.log(res)})()
        max = res.total_hits
        console.log(`爬取成功 偏移量 ${offset}, 总量 ${max}`)
        offset += 100
        // slug: modid, client_side && server_side
        for (let ii of Object.keys(res.hits)) {
            let i = res.hits[ii]
            let t = (() => {
                if (i.server_side == 'unsupported')
                    return 'false'
                if (i.client_side == 'unsupported')
                    return 'true'
                return 'trlse'
            })()
            console.log(`模组 ${i.slug} 类型为 ${t}`)
            fetch(`http://154.201.72.75:3009/modid?modid=${i.slug}&client=${t}`).then((r) => {
                if (r.status >= 200 && r.status <= 299)
                    console.log(`模组 ${i.slug} 提交成功为 ${t}`)
                else
                    console.log(`模组 ${i.slug} 提交失败为 ${t}`)
            })
        }
        if (offset > max) break
    }
})()
