import fetchMock from 'jest-fetch-mock';
import fetchCarImagesHandler, { fetchImagesForCar } from '../src/pages/api/fetchCarImages'; // Passen Sie den Importpfad entsprechend an


fetchMock.enableMocks();

// Direkte Mocks für die Car und CarImages Modelle überspringen
// Stattdessen könnten Sie die Datenbankoperationen als gelöst annehmen, ohne spezifische Mocks

describe('Car Image Functions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchImagesForCar', () => {
    it('fetches images for a given car ID and returns image URLs', async () => {
      const mockImageData = {
        images: {
          image: [
            {
              representation: [
                { "@url": "http://example.com/image1-rule=mo-1024.jpg" },
                { "@url": "http://example.com/image2-rule=mo-1024.jpg" }
              ]
            }
          ]
        }
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockImageData));

      const images = await fetchImagesForCar('123');
      expect(images.id).toBe('123');
      expect(images.images.length).toBeGreaterThan(0);
      expect(images.images[0]).toContain('rule=mo-1024.jpg');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchCarImagesHandler', () => {
    it('fetches and saves car images successfully', async () => {
      const mockImageData = { "search-result": { "max-pages": "1", "ads": { "ad": [] } } };
      fetchMock.mockResponseOnce(JSON.stringify(mockImageData));

      // Simuliertes req und res Objekt für den Test
      const req = { query: {} };
      const res = { 
        status: jest.fn(() => res), 
        json: jest.fn() 
      };

      // Da die direkten Datenbankaufrufe übersprungen werden, konzentriert sich dieser Test auf die Reaktion des Handlers
      // ohne explizite Überprüfung der Car.find oder CarImages.updateOne Aufrufe
      await fetchCarImagesHandler(req, res);

      // Verifizierung, dass die HTTP-Antwort wie erwartet gesendet wurde
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Object)); // Passen Sie dies an die tatsächliche Antwort an
    });
  });
});
