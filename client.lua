	local timeout = 0
	local menu = false

function atm_DisplayHelpText(str)
    SetTextComponentFormat("STRING")
    AddTextComponentString(str)
    DisplayHelpTextFromStringLabel(0, 0, 1, -1)
end

function toggleMenu(b,send)
    if timeout>0 then
        vRP.notify({"Trebuie sa astepti"})
    else
        menu = b
        SetNuiFocus(b,b)
        if b then SetCursorLocation(100, 25) end
        if send then SendNUIMessage({type = "togglemenu", state = b}) end
    end
end

RegisterNUICallback("lose",function(data,cb)
    vRP.notify({"~r~Bank documents were damaged by ink!"})
    toggleMenu(false,false)
    timeout = Config.timeout
end)

RegisterNUICallback("hide",function(data,cb)
    toggleMenu(false,false)
    SetNuiFocus(false,false)
end)

RegisterNUICallback("win",function(data,cb)
    	TriggerServerEvent("fn_atm_rob:win",function()
        vRP.notitfy({"~g~You hacked the ATM!"})
        toggleMenu(false,false)
        timeout = Config.timeout
    end)
end)

function disp_time(time)
    local minutes = math.floor((time%3600)/60)
    local seconds = math.floor(time%60)
    return string.format("~b~%d ~s~minute(s) ~b~%02d~s~ second(s)",minutes,seconds)
end

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if timeout>0 then
            Citizen.Wait(1000)
            timeout=timeout-1
        end
    end
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        for k,v in ipairs(Config.atms) do
            if GetDistanceBetweenCoords(GetEntityCoords(GetPlayerPed(-1)), vector3(v.x,v.y,v.z), false)<distanta then 
                DrawMarker(1, v.x, v.y, v.z-1.0, 0, 0, 0, 0, 0, 0, marker.size.x, marker.size.y, marker.size.z, marker.color.r, marker.color.g, marker.color.b, marker.color.alpha, 0, 0, 0, false)
                if GetDistanceBetweenCoords(GetEntityCoords(GetPlayerPed(-1)), vector3(v.x,v.y,v.z), false)<marker.size.x then
                    if not menu then 
                        atm_DisplayHelpText("Pres ~INPUT_CONTEXT~ to hack") 
                    end
                    if IsControlJustPressed(0, 51) and not menu then
                        toggleMenu(true,true)
                    end
                end
            end
        end
    end
end)