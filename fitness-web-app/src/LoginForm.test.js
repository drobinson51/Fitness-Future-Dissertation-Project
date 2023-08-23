import {render} from "@testing-library/react"
import LoginForm from "./LoginForm";
import { toBeInTheDocument } from "@testing-library/jest-dom/matchers";



test('login form displays correctly', () => {

    const {getLabelText, getText} = render(<LoginForm/>);

    expect(getLabelText(/Email:/i)),toBeInTheDocument();
    expect(getLabelText(/Password:/i)),toBeInTheDocument();
    expect(getText(/Login:/i)),toBeInTheDocument();
})