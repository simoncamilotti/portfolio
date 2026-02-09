import type { AxiosError } from 'axios';
import axios from 'axios';

import { getKeycloakToken } from '../support/keycloak-helper';

describe('Resume CRUD', () => {
  let token: string;
  let createdResumeId: string;

  beforeAll(async () => {
    token = await getKeycloakToken();
  });

  describe('POST /api/resumes', () => {
    it('should return 401 without a token', async () => {
      const error = await axios
        .post('/api/resumes', { title: 'Mon CV', content: 'Contenu' })
        .catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(401);
    });

    it('should return 201 with a valid token and body', async () => {
      const res = await axios.post(
        '/api/resumes',
        { title: 'Mon CV', content: 'Contenu du CV', description: 'Description test' },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      expect(res.status).toBe(201);
      expect(res.data).toEqual(
        expect.objectContaining({
          title: 'Mon CV',
          content: 'Contenu du CV',
        }),
      );
      createdResumeId = res.data.id;
    });
  });

  describe('GET /api/resumes', () => {
    it('should return 401 without a token', async () => {
      const error = await axios.get('/api/resumes').catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(401);
    });

    it('should return 200 with the list containing the created resume', async () => {
      const res = await axios.get('/api/resumes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data).toEqual(expect.arrayContaining([expect.objectContaining({ id: createdResumeId })]));
    });
  });

  describe('GET /api/resumes/:id', () => {
    it('should return 401 without a token', async () => {
      const error = await axios.get(`/api/resumes/${createdResumeId}`).catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(401);
    });

    it('should return 200 with the resume', async () => {
      const res = await axios.get(`/api/resumes/${createdResumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.status).toBe(200);
      expect(res.data).toEqual(expect.objectContaining({ id: createdResumeId, title: 'Mon CV' }));
    });

    it('should return 404 for a non-existent UUID', async () => {
      const error = await axios
        .get('/api/resumes/00000000-0000-0000-0000-000000000000', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(404);
    });
  });

  describe('GET /api/resumes/public', () => {
    it('should return 401 without a token', async () => {
      const error = await axios.get('/api/resumes/public').catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(401);
    });

    it('should return 404 when no public resume exists', async () => {
      const error = await axios
        .get('/api/resumes/public', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(404);
    });
  });

  describe('PATCH /api/resumes/:id', () => {
    it('should return 401 without a token', async () => {
      const error = await axios
        .patch(`/api/resumes/${createdResumeId}`, { title: 'Updated' })
        .catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(401);
    });

    it('should return 200 and update the resume', async () => {
      const res = await axios.patch(
        `/api/resumes/${createdResumeId}`,
        { title: 'CV Updated', content: 'Nouveau contenu', isPublic: false },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      expect(res.status).toBe(200);
      expect(res.data).toEqual(expect.objectContaining({ title: 'CV Updated', content: 'Nouveau contenu' }));
    });
  });

  describe('DELETE /api/resumes/:id', () => {
    it('should return 401 without a token', async () => {
      const error = await axios.delete(`/api/resumes/${createdResumeId}`).catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(401);
    });

    it('should return 204 and delete the resume', async () => {
      const res = await axios.delete(`/api/resumes/${createdResumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.status).toBe(204);
    });

    it('should return 404 for an already deleted resume', async () => {
      const error = await axios
        .delete(`/api/resumes/${createdResumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((e: AxiosError) => e);

      expect(axios.isAxiosError(error)).toBe(true);
      expect((error as AxiosError).response?.status).toBe(404);
    });
  });
});
