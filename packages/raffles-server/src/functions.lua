#!lua name=zigbids

local function update_balance(keys, args)
  local transactionBalanceKey = keys[1]
  local currentBalanceKey = keys[2]
  local id = args[1]
  local newTransactionBalance = tonumber(args[2])
  local transactionBalance = tonumber(redis.call('HGET', transactionBalanceKey, id))
  local currentBalance = tonumber(redis.call('HGET', currentBalanceKey, id))

  -- Don't do anything if cached transaction balance is up to date
  if newTransactionBalance == transactionBalance then
    return currentBalance or transactionBalance
  end

  -- Update cached transaction balance
  redis.call('HSET', transactionBalanceKey, id, newTransactionBalance)

  local newCurrentBalance = newTransactionBalance
  if currentBalance then
    -- Increase the current balance by the difference of transaction balances
    newCurrentBalance = currentBalance + (newTransactionBalance - transactionBalance)
  end
  -- Set cached current balance
  redis.call('HSET', currentBalanceKey, id, newCurrentBalance)
  
  return newCurrentBalance
end

-- yes I wrote my own map because looks like lua doesn't have one
-- so there are two options: if lua doesn't have one, it should be called lula, not lua
-- if it has one, I am the clown here.
local function map(array, callback) -- mapper(value, index, length, array)
  local result = {}
  local length = #array
  for index = 1, length do
    local value = array[index]
    result[index] = callback(value, index, length, array)
  end
  return result
end

local function get_auction_data(keys, args)
  local auction = redis.call('HGETALL', keys[1])
  local start = tonumber(auction[2])
  local expire = tonumber(auction[4])
  -- local maxExpire = tonumber(auction[6])
  -- local bidStep = tonumber(auction[8])
  -- local bidFee = tonumber(auction[10])
  local price = tonumber(auction[12])
  local ranking = redis.call('ZRANGE', keys[2], 0, -1)
  local username_keys = map(ranking, function(item) return 'USER_DB_USERNAME:' .. item end)
  local number_of_bids = #ranking
  local usernames = {}
  if number_of_bids > 0 then
    usernames = redis.call('MGET', unpack(username_keys))
  end
  return { expire, price, ranking, usernames }
end

local function bid(keys, args)
  local keyBalance = keys[1]
  local keyAuction = keys[2]
  local keyRank = keys[3]

  local userId = args[1]
  local auctionId = args[2]

  -- Get auction
  local auction = redis.call('HGETALL', keyAuction)
  local start = tonumber(auction[2])
  local expire = tonumber(auction[4])
  local maxExpire = tonumber(auction[6])
  local bidStep = tonumber(auction[8])
  local bidFee = tonumber(auction[10])

  if not expire or not maxExpire or not bidStep then
    return -3
  end

  -- Check balance
  local balance = redis.call('HGET', keyBalance, userId)
  if not balance then
    return -1
  elseif tonumber(balance) < bidFee then
    return -2
  end

  -- Get time in microseconds
  local time = redis.call('TIME')
  local microtime = tonumber(time[1]) * 1000000 + tonumber(time[2])

  if microtime < start then
    return -5
  end

  if microtime < expire then
    -- Decrease user balance
    redis.call('HINCRBY', keyBalance, userId, -bidFee)
    -- Increase auction price
    redis.call('HINCRBY', keyAuction, 'price', bidStep)
    -- Add user to rank
    redis.call('ZADD', keyRank, 'GT', microtime, userId)

    if expire < maxExpire and expire - microtime <= 10 * 1000000 then
      -- Extend expiration date
      local randomSecs = math.random(5, 12)
      redis.call('HSET', keyAuction, 'expire', expire + randomSecs * 1000000)
    end

    -- Return new balance
    return balance - bidFee
  end
  return -4
end

redis.register_function('update_balance', update_balance)
redis.register_function('get_auction_data', get_auction_data)
redis.register_function('bid', bid)
