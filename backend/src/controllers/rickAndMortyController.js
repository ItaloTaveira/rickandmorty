// Controller para buscar dados da API Rick and Morty
const https = require('https');

class RickAndMortyController {
  /**
   * Busca personagens da API Rick and Morty
   * Suporta paginação através do parâmetro page
   */
  async getCharacters(req, res) {
    try {
      // Obter a página da consulta ou definir 1 como padrão
      const page = req.query.page || 1;

      // URL da API
      const apiUrl = `https://rickandmortyapi.com/api/character?page=${page}`;

      // Fazer a requisição para a API externa
      https.get(apiUrl, (response) => {
        let data = '';

        // Acumular dados recebidos
        response.on('data', (chunk) => {
          data += chunk;
        });

        // Quando todos os dados forem recebidos
        response.on('end', () => {
          try {
            // Parse do JSON
            const characters = JSON.parse(data);

            // Processar os dados para o formato desejado
            const formattedCharacters = characters.results.map(character => ({
              id: character.id,
              name: character.name,
              status: character.status,
              species: character.species,
              location: (character.location && character.location.name === 'unknown') ? 'desconhecido' : character.location,
              image: character.image
            }));

            // Retornar os dados formatados com informações de paginação
            return res.status(200).json({
              results: formattedCharacters,
              info: characters.info
            });
          } catch (error) {
            console.error('Erro ao processar dados da API:', error);
            return res.status(500).json({
              error: 'Erro ao processar dados da API Rick and Morty'
            });
          }
        });
      }).on('error', (error) => {
        console.error('Erro na requisição para a API Rick and Morty:', error);
        return res.status(500).json({
          error: 'Erro ao comunicar com a API Rick and Morty'
        });
      });
    } catch (error) {
      console.error('Erro interno:', error);
      return res.status(500).json({
        error: 'Erro interno ao buscar personagens'
      });
    }
  }
}

module.exports = RickAndMortyController;