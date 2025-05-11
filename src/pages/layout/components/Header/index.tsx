import { AppBar, Avatar, Box, IconButton, MenuList, Toolbar, Tooltip, Typography } from "@mui/material"
import useNavegacaoStore from "../../../../store/navegacao/useNavegacaoStore"
import { MenuBook, MenuBookTwoTone, MenuOpen, MenuOpenTwoTone } from "@mui/icons-material";
import ConfigMenu from "./ConfigMenu";

const Header = () => {
    const { menu } = useNavegacaoStore();
    return <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => menu.menuEsquerdo.open()}
                >
                    <MenuOpenTwoTone />
                </IconButton>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    CVE Forger
                </Typography>
                <ConfigMenu />
            </Toolbar>
        </AppBar>
    </Box>
}

export default Header