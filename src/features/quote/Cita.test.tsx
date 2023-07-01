import  userEvent from "@testing-library/user-event";
import { API_URL } from "../../app/constants";
import { mockedQuotes } from "./test/mockedQuotes";
import { render } from "../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import {rest} from "msw";
import Cita from "./Cita";


const randomQuote = mockedQuotes[1].data;

const validQueries = mockedQuotes.map((q) => q.query);

const handlers = [
    rest.get(`${API_URL}`, (req, res, ctx) => {
      const character = req.url.searchParams.get('character');
  
      if (character === null) {
        return res(ctx.json([randomQuote]), ctx.delay(150));
      }
  
      if (validQueries.includes(character)) {
        const quote = mockedQuotes.find((q) => q.query === character);
        return res(ctx.json([quote?.data]));
      }
  
      return res(ctx.json([]), ctx.delay(150));
    }),
  ];

  const server = setupServer(...handlers);
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());




describe("Quote component" , () => {
    describe("Why the component is loaded by default", ()=> {
      
        it('Sould render correctly', async () => {
          render(
            <Cita/>
          )
          // expect(screen.getByText(/no se encontro ninguna cita/i)).toBeInTheDocument();
          expect(
            screen.getByText(/No se encontro ninguna cita/i)
          ).toBeInTheDocument();
        });
        it("Should Display a 'None quote found' message", () =>{
          render(
            <Cita/>
          )
          expect(screen.getByText(/no se encontro ninguna cita/i)).toBeInTheDocument();
        })
    });

    describe("When the user does not complete the input", () => {
      it("Should display a loading message while data is being fetched", async()=>{
        render(
          <Cita/>
        );
        const button = await screen.findByLabelText(/Obtener Cita aleatoria/i);
        await userEvent.click(button);
        await waitFor (() => {
          expect(screen.getByText(/cargando/i)).toBeInTheDocument();
        });
      });

      it("Should display a random quote when the user clicks the button", async () => {
        render(<Cita />);
        const button = await screen.findByLabelText(/Obtener cita aleatoria/i);
        await userEvent.click(button);
        await waitFor(() => {
          expect(screen.getByText(/By chilling my loins I increase the chances of impregnating my wife./i))
            .toBeInTheDocument();
        });
      });
    });

    describe("When the user does complete the input", () => {
      it("Should display a quote when the user complete the input and clicks the button", async()=>{
        render(
          <Cita/>
        );
        const input = screen.getByRole("textbox", {name:/Author Cita/i});
        await userEvent.click(input);
        await userEvent.keyboard(mockedQuotes[0].query);
        const button = await screen.findByLabelText(/Obtener Cita/i);
        await userEvent.click(button);
        await waitFor (() => {
          expect(screen.getByText(/I used to be with it. But then they changed what it was. Now what I'm with isn't it, and what's it seems scary and wierd. It'll happen to you./i)).toBeInTheDocument();
        })
      });

      it("Should display a loading message while data is being fetched", async () => {
        render(
          <Cita/>
        );
        const button = await screen.findByLabelText(/Obtener Cita aleatoria/i);
        await userEvent.click(button);
        await waitFor (() => {
          expect(screen.getByText(/cargando/i)).toBeInTheDocument();
        });
      });

      it("Should display 'Por favor ingrese un nombre válido' when the user complete the input with numbers and clicks the button", async () => {
        render(
          <Cita/>
        );
        const input = screen.getByRole("textbox", {name:/Author Cita/i});
        await userEvent.click(input);
        await userEvent.keyboard("01231");
        const button = await screen.findByLabelText(/Obtener Cita/i);
        await userEvent.click(button);
        await waitFor (() => {
          expect(screen.getByText(/Por favor ingrese un nombre válido/i)).toBeInTheDocument();
        })
      });

    });
})
