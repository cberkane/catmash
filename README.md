# Catmash

Catmash is a web application that allows users to vote between two randomly selected cat images. The app keeps track of the number of wins and losses for each cat and displays the top cats based on their win ratios.


## To install the project
1. Clone the repository:
   ```bash
   git clone https://github.com/cberkane/catmash.git
   ```
2. Navigate to the project directory:
   ```bash
   cd catmash
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   ng serve
   ```
5. Open your browser and go to `http://localhost:4200` to see the app in action.


## Approach
The project is built using Angular for the front-end and Firebase for the persistence. The app fetches cat images from the API provided by L'Atelier and stores the voting data in Firestore. The API is considered as the source of truth.

Observables are used to retrieve data, and promises are used for simple operations (updates). There is a strong argument for using promises for all the operations, since the data flow is not complex and Observables seems a bit overkill. But since Angular is built around observables, I decided to use them for data retrieval.

## To improve the project
- [ ] Write unit tests for the services, at least.
- [ ] use Signals to improve reactivity.
- [ ] Implement state management to avoid multiple HTTP calls.
- [ ] Improve UI interactions.
- [ ] Improve error handling (more explicit and adequat classes).
- [ ] Add responsivness for mobile devices.
   