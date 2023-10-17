import { Component, Fragment } from "react";
import { Button, ButtonGroup, Input, Table } from "reactstrap";
import moment from 'moment';
import { FaLock, FaLockOpen, FaTrash } from "react-icons/fa"
import authService from "../auth/AuthorizationService";
import { Navigate } from 'react-router-dom';
import manageService from "./ManageService";

export class Manage extends Component {
    static displayName = Manage.name;
    
    constructor(props) {
        super(props);

        this.onBlock = this.onBlock.bind(this);
        this.onUnblock = this.onUnblock.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onAllChecked = this.onAllChecked.bind(this);

        this.state = {
            users: [],
            loading: true,
            unauthorized: false
        }
    }
    
    componentDidMount() {
        this.populateUsersData();
    }

    onBlock = async () => {
        var users = this.getCheckedUsers();
        users = this.moveCurrentUserToEndIfExists(users);

        for (let u of users) {
            const result = await manageService.blockUser(u.id);
            await this.check401Status(result);
        }

        this.populateUsersData();
        this.uncheckCheckboxes();
    }

    onUnblock = async () => {
        const users = this.getCheckedUsers();

        for (let u of users) {
            const result = await manageService.unblockUser(u.id);
            await this.check401Status(result);
        }

        this.populateUsersData();
        this.uncheckCheckboxes();
    }

    onDelete = async () => {
        var users = this.getCheckedUsers();
        users = this.moveCurrentUserToEndIfExists(users);

        for (let u of users) {
            const result = await manageService.deleteUser(u.id);
            await this.check401Status(result);
        }
        
        this.populateUsersData();
    }

    onAllChecked = (e) => {
        this.state.users.map(u => {
            document.getElementById(u.id).checked = e.target.checked;
        });
    }

    // detect self-blocking and shifting that user to the last position in the array
    // it is required, because a self-blocked user will not be able to block other users in the array
    moveCurrentUserToEndIfExists(users) {
        const currentUser = users.find(u => u.id == authService.user.id);
        if (currentUser) {
            users = users.filter(u => u.id != currentUser.id);
            users.push(currentUser);
        }
        return users;
    }

    getCheckedUsers() {
        return this.state.users.filter(u => document.getElementById(u.id).checked);
    }

    uncheckCheckboxes() {
        document.getElementById("tableCheckbox").checked = false;
        this.state.users.forEach(u => {
            document.getElementById(u.id).checked = false;
        });
    }

    formatUTC(utc) {
        return moment(utc).format("DD.MM.yyyy HH.mm");
    }

    renderToolbar() {
        return (<ButtonGroup size="sm">
            <Button onClick={this.onBlock}>
                <FaLock className="toolbar-icon" /> Block
            </Button>
            <Button onClick={this.onUnblock}>
                <FaLockOpen className="toolbar-icon" /> Unblock
            </Button>
            <Button onClick={this.onDelete}>
                <FaTrash className="toolbar-icon" /> Delete
            </Button>
        </ButtonGroup>);
    }

    renderUsersTable(users) {
        if (!users) {
            return <em>No data!</em>;
        }

        return (<Fragment>
                {this.renderToolbar()}
                <Table responsive className="table-striped">
                    <thead>
                        <tr>
                            <th><Input id="tableCheckbox" type="checkbox" onChange={this.onAllChecked} /></th>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Registered</th>
                            <th>Logined</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, i) =>
                            <tr key={i}>
                                <td><Input type="checkbox" id={u.id} /></td>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{this.formatUTC(u.registrationDate)}</td>
                                <td>{this.formatUTC(u.lastLoginDate)}</td>
                                <td>{u.isLocked ? "Blocked" : "Active" }</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Fragment>
        );
    }

    render() {
        const { users, loading, unauthorized } = this.state;

        if(unauthorized) {
            return <Navigate replace to="/login?returnUrl=/manage" />;
        }

        const content = loading
            ? (<em>Loading...</em>)
            : this.renderUsersTable(users);

        return (<div>
            <h1 className="form-header-1">Manage users</h1>
            {content}
        </div>)
    }

    async check401Status(result) {
        if (result.code == 401) {
            await authService.updateState();
            this.setState({ loading: false, unauthorized: true });
        }
    }

    async populateUsersData() {
        const result = await manageService.getUsers();
        await this.check401Status(result);
        this.setState({ users: result.data, loading: false });
    }
}