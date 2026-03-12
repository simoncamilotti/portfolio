import { ResumesService } from './resumes.service';

vi.mock('../api/axiosInstance', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

import { axiosInstance } from '../api/axiosInstance';

const mockedAxios = {
  get: vi.mocked(axiosInstance.get),
  post: vi.mocked(axiosInstance.post),
  delete: vi.mocked(axiosInstance.delete),
  patch: vi.mocked(axiosInstance.patch),
};

describe('ResumesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllResumes', () => {
    it('should call GET resumes and return data', async () => {
      const resumes = [{ id: '1', title: 'CV 1' }];
      mockedAxios.get.mockResolvedValue({ data: resumes });

      const result = await ResumesService.getAllResumes();

      expect(mockedAxios.get).toHaveBeenCalledWith('resumes');
      expect(result).toEqual(resumes);
    });
  });

  describe('getResumeById', () => {
    it('should call GET resumes/:id and return data', async () => {
      const resume = { id: '42', title: 'Mon CV' };
      mockedAxios.get.mockResolvedValue({ data: resume });

      const result = await ResumesService.getResumeById('42');

      expect(mockedAxios.get).toHaveBeenCalledWith('resumes/42');
      expect(result).toEqual(resume);
    });
  });

  describe('deleteResumeById', () => {
    it('should call DELETE resumes/:id', async () => {
      mockedAxios.delete.mockResolvedValue({});

      await ResumesService.deleteResumeById('42');

      expect(mockedAxios.delete).toHaveBeenCalledWith('resumes/42');
    });
  });

  describe('createResume', () => {
    it('should call POST resumes and return data', async () => {
      const created = { id: '99', title: 'Nouveau' };
      mockedAxios.post.mockResolvedValue({ data: created });

      const result = await ResumesService.createResume({ title: 'Nouveau', isPublic: false });

      expect(mockedAxios.post).toHaveBeenCalledWith('resumes', { title: 'Nouveau', isPublic: false });
      expect(result).toEqual(created);
    });
  });

  describe('setResumeIsPublic', () => {
    it('should call PATCH resumes/:id/public with dto', async () => {
      mockedAxios.patch.mockResolvedValue({ data: {} });

      await ResumesService.setResumeIsPublic('42', { isPublic: true });

      expect(mockedAxios.patch).toHaveBeenCalledWith('resumes/42/public', { isPublic: true });
    });
  });
});
