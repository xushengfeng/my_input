-- Rime 云输入客户端
local http = require("http") -- 需要 Rime 编译时启用 LuaSocket 支持

local function cloud_translator(input, seg)
    -- 只处理长度大于2的输入
    if string.len(input) < 2 then return end

    -- 请求云服务器
    local response = http.request("http://localhost:8000/?input=" .. input)
    if not response then return end

    -- 解析JSON响应
    local data = rime_json.decode(response)
    if not data.candidates then return end

    -- 生成候选词
    for _, item in ipairs(data.candidates) do
        yield(Candidate("cloud", seg.start, seg._end, item.text, item.weight .. " "))
    end
end

return cloud_translator