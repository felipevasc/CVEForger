import { AppBar, Avatar, Box, Divider, ListItemIcon, Menu, MenuItem, Tab, Tabs } from "@mui/material"
import useNavegacaoStore from "../../../../store/navegacao/useNavegacaoStore"
import { Logout, PersonAdd, Settings } from "@mui/icons-material"
import { useRef, useState } from "react"

const TopBar = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return <>

        <Box sx={{ bgcolor: 'background.paper', width: '100%', }}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                    <Tab label="Item FOR" />
                </Tabs>
            </AppBar>
        </Box>
    </>
}

export default TopBar